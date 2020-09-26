import { SceneConfig } from './scene-config';
import { SceneDescriptor } from './scene-descriptor';

/**
 * @description A service which parses config into a model and hooks accessors and skulptAPI to the model based on sceneType
 */
export interface SceneBuilder {
  buildScene(config: SceneConfig): SceneDescriptor;
}
