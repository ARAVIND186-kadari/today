import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react';
import { nodeTypes } from './CustomNodes';
import { useWorkflowStore } from '../../store/workflowStore';

export default function WorkflowCanvas({ readOnly = false }) {
  const { nodes, edges, setNodes, setEdges, setSelectedNode, addNode } = useWorkflowStore();
  const reactFlowWrapper = useRef(null);

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => {
        // Apply changes
        let updated = [...nds];
        changes.forEach((change) => {
          if (change.type === 'position' && change.position) {
            updated = updated.map((n) =>
              n.id === change.id ? { ...n, position: change.position } : n
            );
          } else if (change.type === 'select') {
            updated = updated.map((n) =>
              n.id === change.id ? { ...n, selected: change.selected } : n
            );
          } else if (change.type === 'remove') {
            updated = updated.filter((n) => n.id !== change.id);
          }
        });
        return updated;
      });
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => {
        let updated = [...eds];
        changes.forEach((change) => {
          if (change.type === 'remove') {
            updated = updated.filter((e) => e.id !== change.id);
          }
        });
        return updated;
      });
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#38bdf8' } }, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event, node) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Handle Drag from Palette Drop
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const rawData = event.dataTransfer.getData('application/agentflow-node');
      if (!rawData) return;

      try {
        const item = JSON.parse(rawData);
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = {
          x: event.clientX - reactFlowBounds.left - 100,
          y: event.clientY - reactFlowBounds.top - 40,
        };

        const newNode = {
          id: `node_${Date.now()}`,
          type: item.type,
          position,
          data: {
            label: item.label,
            description: item.description,
            provider: item.provider,
            actionType: item.actionType,
            config: item.defaultConfig || {},
          },
        };

        addNode(newNode);
      } catch (e) {
        console.error('Failed to parse dropped node:', e);
      }
    },
    [addNode]
  );

  return (
    <div ref={reactFlowWrapper} className="w-full h-full min-h-[550px] relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
      >
        <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300 [&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button:hover]:!bg-slate-700" />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'trigger': return '#38bdf8';
              case 'action': return '#c084fc';
              case 'ai': return '#fbbf24';
              case 'integration': return '#34d399';
              default: return '#64748b';
            }
          }}
          maskColor="rgba(15, 23, 42, 0.7)"
          className="!bg-slate-900 !border-slate-800 rounded-xl overflow-hidden"
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1.2} color="#1e293b" />
      </ReactFlow>
    </div>
  );
}
