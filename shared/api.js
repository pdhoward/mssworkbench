const { DescribeConfigResponse, 
        ITopicMetadata, 
        SeekEntry, 
        KafkaMessage } = require("kafkajs")
const { Schema, Type } = require("avsc")


const MaybeError = { error: String }
const TopicOffsets = { high: String, low: String}
const ConsumerOffsets = { metadata: String | null, partitionOffsets: TopicOffsets }
const TopicConsumerGroups = {groupId: String, offsets: ConsumerOffsets}
const TopicMessage = { topic: String, partition: Number, value: String, key: String, message: KafkaMessage, schemaType: Type | undefined }
const TopicMessages = { messages: Array, hasTimeout: Boolean }
const Broker = { nodeId: Number, host: String, port: Number }
const GetTopicsResult = { topics: Array }
const GetTopicOffsetsResult = { offsets: TopicOffsets }
const GetTopicConfigsResult =  DescribeConfigResponse
const GetBrokerConfigsResult = DescribeConfigResponse
const GetTopicConsumerGroupsResult = TopicConsumerGroups
const GetTopicResult = { offsets: TopicOffsets, config: DescribeConfigResponse, groups: TopicConsumerGroups}
const GetClusterResult = { brokers: Array, controller: Number | null, clusterId: String }
const GetTopicOffsetsByTimestapResult =  SeekEntry
const GetTopicMessagesResult = TopicMessages
const GetSubjectsResult = String
const GetSubjectVersionsResult = Number
const GetSchemaResult = { schema: Schema, id: Number }
const ConnectorState = `RUNNING` | `FAILED` | `PAUSED`
const ConnectorConfig = { [{key: String}]: String }
const GetConnectorsResult = String
const GetConnectorStatusResult = { name: String, connector: { state: ConnectorState, worker_id: String }, tasks: { state: ConnectorState, id: Number, worker_id: String}, type: String }
const GetConnectorConfigResult =  ConnectorConfig
const GetConnectorTasksResult =  { id: {connector: String, task: Number}, config: {[{key: String}]: String} }
const GetConnectorTaskStatusResult = { state: ConnectorState, id: Number, worker_id: String }

module.exports = {
    MaybeError,
    TopicOffsets,
    ConsumerOffsets,
    TopicConsumerGroups,
    TopicMessage,
    TopicMessages,
    Broker,
    GetTopicsResult,
    GetTopicOffsetsResult,
    GetTopicConfigsResult,
    GetBrokerConfigsResult,
    GetTopicConsumerGroupsResult,
    GetTopicResult,
    GetClusterResult,
    GetTopicOffsetsByTimestapResult,
    GetTopicMessagesResult,
    GetSubjectsResult,
    GetSubjectVersionsResult,
    GetSchemaResult,
    ConnectorState,
    ConnectorConfig,
    GetConnectorsResult,
    GetConnectorStatusResult,
    GetConnectorConfigResult,
    GetConnectorTasksResult,
    GetConnectorTaskStatusResult
}
