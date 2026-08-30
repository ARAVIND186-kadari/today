import { create } from 'zustand';

export const useWorkflowStore = create((set, get) => ({
  workflow: null,
  nodes: [],
  edges: [],
  selectedNode: null,
  isDirty: false,

  setWorkflow: (workflow) => {
    set({
      workflow,
      nodes: workflow?.nodes || [],
      edges: workflow?.edges || [],
      selectedNode: null,
      isDirty: false,
    });
  },

  setNodes: (nodes) => {
    const updatedNodes = typeof nodes === 'function' ? nodes(get().nodes) : nodes;
    set({ nodes: updatedNodes, isDirty: true });
  },

  setEdges: (edges) => {
    const updatedEdges = typeof edges === 'function' ? edges(get().edges) : edges;
    set({ edges: updatedEdges, isDirty: true });
  },

  setSelectedNode: (node) => {
    set({ selectedNode: node });
  },

  updateNodeData: (nodeId, dataUpdate) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) => {
        if (node.id === nodeId) {
          const mergedData = { ...node.data, ...dataUpdate };
          return { ...node, data: mergedData };
        }
        return node;
      });

      const updatedSelected = state.selectedNode?.id === nodeId
        ? { ...state.selectedNode, data: { ...state.selectedNode.data, ...dataUpdate } }
        : state.selectedNode;

      return {
        nodes: updatedNodes,
        selectedNode: updatedSelected,
        isDirty: true,
      };
    });
  },

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
      selectedNode: node,
      isDirty: true,
    }));
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode,
      isDirty: true,
    }));
  },

  resetDirty: () => set({ isDirty: false }),
}));
