import { SceneReader } from './common/readers/scene.reader';
import { SceneWriter } from './common/writers/scene.writer';
import { SceneSkulptService } from './common/scene-skulpt-service';
import { Singleton } from '../singleton.decorator';

/**
 * This service is used to hook **accessors** (which is a common term for **{@link SceneReader}** and **{@link SceneWriter}**)
 * to the corresponding type of **{@link SceneModel}** based on it's *sceneType* property
 */
@Singleton
export class SceneAccessorsService {

  private _reader: SceneReader = null;
  private _writer: SceneWriter = null;
  private _sceneSkulptService: SceneSkulptService = null;

  constructor() {
  }

  get reader(): SceneReader {
    return this._reader;
  }

  set reader(reader: SceneReader) {
    this._reader = reader;
  }

  get writer(): SceneWriter {
    return this._writer;
  }

  set writer(writer: SceneWriter) {
    this._writer = writer;
  }

  get sceneSkulptService(): SceneSkulptService {
    return this._sceneSkulptService;
  }

  set sceneSkulptService(skService: SceneSkulptService) {
    this._sceneSkulptService = skService;
  }

  get sceneIsPlaybackable(): boolean {
    return this._reader?.sceneIsPlaybackable();
  }


  addApiToSkulpt(): void {
    this._sceneSkulptService.addApiToSkulpt();
  }

}
