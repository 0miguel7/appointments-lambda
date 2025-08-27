import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

export class DynamoDBService {
  private client: DynamoDBDocumentClient;
  private tableName = process.env.DYNAMODB_TABLE_NAME!;

  constructor() {
    const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION || "us-east-1" });
    this.client = DynamoDBDocumentClient.from(dynamoClient);
  }

  async put(item: any): Promise<void> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  }

  async get(key: any): Promise<any> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: key,
      })
    );
    return result.Item || null;
  }

  async query(params: any): Promise<any[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        ...params,
      })
    );
    return result.Items || [];
  }

  async update(key: any, updateParams: any): Promise<any> {
    const result = await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: key,
        ReturnValues: "ALL_NEW",
        ...updateParams,
      })
    );
    return result.Attributes;
  }

  async delete(key: any): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: key,
      })
    );
  }
}
