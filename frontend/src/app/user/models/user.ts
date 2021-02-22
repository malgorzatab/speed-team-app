import {Project} from "../../project/models/project";
import {Task} from 'src/app/my-tasks/models/task';

export class User {
  _id: string;
  username: string;
  email: string;
  password: string;
  userPorjects: Array<Project> = [];
  userTasks: Array<Task> = [];
}
