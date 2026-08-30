/**
 * Planner Agent
 * Analyzes workflow topology, validates DAG, computes topological execution order,
 * and emits a plan confidence score.
 */
class PlannerAgent {
  constructor() {
    this.name = 'planner';
  }

  async plan(workflowSnapshot) {
    const { nodes = [], edges = [] } = workflowSnapshot;

    if (nodes.length === 0) {
      throw new Error('Workflow contains no nodes to execute');
    }

    // Build adjacency list and in-degree map for topological sort (Kahn's Algorithm)
    const inDegree = new Map();
    const adjList = new Map();
    const nodeMap = new Map();

    nodes.forEach((node) => {
      inDegree.set(node.id, 0);
      adjList.set(node.id, []);
      nodeMap.set(node.id, node);
    });

    edges.forEach((edge) => {
      if (adjList.has(edge.source) && inDegree.has(edge.target)) {
        adjList.get(edge.source).push(edge.target);
        inDegree.set(edge.target, inDegree.get(edge.target) + 1);
      }
    });

    // Find all nodes with 0 in-degree (entry/trigger nodes)
    const queue = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    const executionPlan = [];

    while (queue.length > 0) {
      const currentId = queue.shift();
      executionPlan.push(nodeMap.get(currentId));

      const neighbors = adjList.get(currentId) || [];
      for (const neighborId of neighbors) {
        inDegree.set(neighborId, inDegree.get(neighborId) - 1);
        if (inDegree.get(neighborId) === 0) {
          queue.push(neighborId);
        }
      }
    }

    // Check for cycles
    if (executionPlan.length !== nodes.length) {
      console.warn('[PlannerAgent] Graph contains disconnected nodes or cycles; defaulting to node list order');
      // Append any unvisited nodes
      nodes.forEach((node) => {
        if (!executionPlan.find((n) => n.id === node.id)) {
          executionPlan.push(node);
        }
      });
    }

    // Calculate confidence score based on node completeness
    let configuredNodes = 0;
    nodes.forEach((node) => {
      if (node.data && (node.data.actionType || node.data.provider)) {
        configuredNodes++;
      }
    });

    const confidenceScore = Math.min(
      1.0,
      Math.max(0.7, Number((0.8 + (configuredNodes / nodes.length) * 0.19).toFixed(2)))
    );

    return {
      success: true,
      agent: this.name,
      plan: executionPlan.map((n) => ({
        id: n.id,
        label: n.data?.label || n.id,
        type: n.type || 'action',
        provider: n.data?.provider || 'system',
        actionType: n.data?.actionType || 'execute',
      })),
      confidenceScore,
      totalSteps: executionPlan.length,
      estimatedDurationMs: executionPlan.length * 450,
    };
  }
}

module.exports = new PlannerAgent();
