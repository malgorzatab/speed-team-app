import {Project} from "../../project/models/project";

export class Task {
  _id: string;
  name: string;
  member: string;
  state: string;
  storyPoint: number;
  project: string;

  constructor(name: string, member: string, state: string, storyPoint: number, project: string) {
    this.name = name;
    this.member = member;
    this.state = state;
    this.storyPoint = storyPoint;
    this.project = project;
  }

}


export class TaskPaginationRsp {
  docs: Task[];
  total: number;
  pages: number;
  page: number;
  limit: number;
}
