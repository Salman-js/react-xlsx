import express, { Express } from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';
import fileRoutes from './routes/fileRoutes';
import dbConfig from './config/database';
import File from './models/File';

class App {
  public app: Express;
  public port: number;
  public sequelize: Sequelize;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.sequelize = new Sequelize(dbConfig);

    this.initializeMiddlewares();
    this.initializeModels();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private initializeModels() {
    File.initialize(this.sequelize);
  }

  private initializeRoutes() {
    this.app.use('/', fileRoutes);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default App;
