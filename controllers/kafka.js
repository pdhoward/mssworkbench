
///////////////////////////////////////////////
////////////  Kafka Produce Event     ////////
/////////////////////////////////////////////

// kafka events needs to be intialized
// Function takes the producer object and writes to event steam
exports.kafka = (producer, data) => {
    return new Promise(async (resolve, reject) => {
      let producemessage = Buffer.from(JSON.stringify(data));

      // message specified in Buffer section below will be created on topic testTopic
      // make sure you create the topic before producing the message if autocreate topic is disabled.
      try {
        await producer.produce(
          "sales",
          null,
          producemessage,
          null,
          Date.now()
        );
        resolve('success');
      } catch (e) {
        reject(e);
      }
    });
  }

