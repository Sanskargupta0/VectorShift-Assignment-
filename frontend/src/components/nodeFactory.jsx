import { useMemo } from 'react';
import { BaseNode } from './BaseNode';
import { createNodeConfig } from './nodeConfigs';

const createNode = (type) => {
  return ({ id, data }) => {
    const config = useMemo(() => createNodeConfig(type), []);
    return <BaseNode id={id} data={data} config={config} />;
  };
};

export const InputNode = createNode('input');
export const OutputNode = createNode('output');
export const LLMNode = createNode('llm');
export const TextNode = createNode('text');


export const FilterNode = createNode('filter');
export const TransformNode = createNode('transform');
export const ConditionalNode = createNode('conditional');
export const AggregatorNode = createNode('aggregator');
export const DelayNode = createNode('delay');
