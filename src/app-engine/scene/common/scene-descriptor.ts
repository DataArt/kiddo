import { SceneModel } from './models/scene-model';
import { SceneReader } from './readers/scene.reader';
import { SceneWriter } from './writers/scene.writer';
import { SceneSkulptService } from './scene-skulpt-service';

/**
 * @description Scene descriptor is an object used to link concrete model, readers, writers and skulpt API together
 */
export interface SceneDescriptor {
  model: SceneModel;
  reader: SceneReader;
  writer: SceneWriter;
  skulptService: SceneSkulptService;
}
