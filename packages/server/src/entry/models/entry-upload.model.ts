import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

/**
 * The intermediate representation for an entry as it is being added into
 * SignLab.
 */
@Schema()
export class EntryUpload {
  @Prop({ required: true })
  session!: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  metadata: any;

  @Prop({ required: true })
  filename!: string;

  @Prop({ required: true })
  entryID!: string;
}

export type EntryUploadDocument = EntryUpload & Document;
export const EntryUploadSchema = SchemaFactory.createForClass(EntryUpload);
