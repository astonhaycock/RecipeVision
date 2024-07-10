import type { Context } from "elysia";
import type { SessionData } from "elysia-session/session";
import type { Store } from "elysia-session/store";
import * as mongoose from 'mongoose';



export interface ISession extends mongoose.Document {
  _id: string;
  sessionData: SessionData;
}

export class MongooseStore implements Store {
  private db: typeof import('mongoose');
  private collection: string;
  private schema: mongoose.Schema | null;
  private model: mongoose.Model<ISession> | null;

  constructor(db: typeof import('mongoose'), collection: string) {
    this.db = db;
    this.collection = collection;
    this.schema = new mongoose.Schema({
      _id: String,
      sessionData: { type: JSON },
    })
    this.model = mongoose.model<ISession>(collection, this.schema);
  }

  getSession (id?: string | undefined, ctx?: Context): SessionData | Promise<SessionData | null | undefined> | null | undefined {
    if (!id) return null;
    if (this.model) {
      this.model.findOne({ _id: id }, (err: Error, session: ISession) => {
        if (err || !session) return null;
        return session.sessionData
      })
    } else
      return null
  }

  createSession (data: SessionData, id: string, ctx?: Context): void | Promise<void> {
    console.log("createSession")
    if (this.model) {
      const session = new this.model({
        _id: id,
        sessionData: data,
      })
      session.save();
    }
  }

  deleteSession (id?: string | undefined, ctx?: Context): void | Promise<void> {
    if (!id) return;
    console.log("deleteSession")
    if (this.model) {
      this.model.deleteOne({ _id: id })
    }
  }

  persistSession (data: SessionData, id?: string, ctx?: Context): Promise<void> | void {
    if (!id) return;
    console.log("persistSession")
    if (this.model) {
      this.model.updateOne({ _id: id }, { sessionData: data })
    }
  }
}
