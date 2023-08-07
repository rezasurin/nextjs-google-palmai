import { DiscussServiceClient } from "@google-ai/generativelanguage";

const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");

export type ModelName =
  | "models/text-bison-001"
  | "models/chat-bison-001"
  | "models/embedding-gecko-001";

export const palmAIGenerateText = async (apiKey, prompt, modelName) => {
  const client = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(apiKey),
  });

  try {
    const response = await client.generateText({
      model: modelName,
      prompt: {
        text: prompt,
      },
    });
    console.log(response, "<<< cekresponse");
    return JSON.stringify(response);
  } catch (error) {}
};

export type MessagesProps = Array<{ content: string }>;

// interface PalmAIGenerateChatsProps {
//   apiKey: string
//   messages: MessagesProps
//   modelName: ModelName
// }

export const palmAiGenerateChats = async (
  apiKey: string,
  messages: MessagesProps,
  modelName: ModelName,
  context?: string
) => {
  const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(apiKey),
  });

  try {
    const result = await client.generateMessage({
      model: modelName, // Required. The model to use to generate the result.
      temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
      candidateCount: 1, // Optional. The number of candidate results to generate.
      prompt: {
        // optional, preamble context to prime responses
        context:
          "Respond to all questions with summary of the content by the given link. If there's still any questions about the content, try to answer it based on your knowledge, make your answer clear and easy to understand.",
        // context: context ?? '',
        // Optional. Examples for further fine-tuning of responses.
        examples: [
          {
            input: {
              content:
                "https://medium.com/towardsdev/monitoring-express-js-with-opentelemetry-and-uptrace-13b4383d8b03",
            },
            output: {
              content: `
              Sure, here is a summary of the article "Monitoring Express.js with OpenTelemetry and Uptrace" by Uptrace:
              
              What is tracing? Tracing is a way of tracking the journey of a single user request through a distributed system. This can be helpful for identifying performance bottlenecks, diagnosing issues, and analyzing the overall system behavior.
              What is OpenTelemetry? OpenTelemetry is an open-source observability framework that can be used to collect and send telemetry data from applications. This data can then be used to create traces, metrics, and logs.
              How to use OpenTelemetry with Express.js The article walks through the steps of using OpenTelemetry with Express.js. This includes installing the OpenTelemetry libraries, instrumenting the application, and sending the telemetry data to Uptrace.
              Benefits of using OpenTelemetry with Uptrace Uptrace is a distributed tracing platform that can be used to analyze telemetry data from OpenTelemetry-instrumented applications. Uptrace provides a variety of features that can be used to identify performance bottlenecks, diagnose issues, and analyze the overall system behavior.
              Here are some of the benefits of using OpenTelemetry with Uptrace:
              
              Easy to use: OpenTelemetry and Uptrace are both easy to use. The OpenTelemetry libraries are well-documented and the Uptrace UI is intuitive.
              Flexible: OpenTelemetry can be used to collect telemetry data from a variety of applications. Uptrace can be used to analyze telemetry data from a variety of sources.
              Scalable: OpenTelemetry and Uptrace are both scalable. They can be used to collect and analyze telemetry data from large-scale applications.
              I hope this summary is helpful. Please let me know if you have any other questions.`,
            },
          },
          {
            input: {
              content:
                "Can you give me a step-by-step how to use OpenTelemetry and Uptrace ?",
            },
            output: {
              content: `
              Here are the details for each step:
              1. Install the OpenTelemetry libraries.
              You can install the OpenTelemetry libraries using npm:
              npm install @opentelemetry/api @opentelemetry/exporter-otlp @opentelemetry/instrumentation-express
              2. Instrument the application.
              Once you have installed the OpenTelemetry libraries, you need to instrument your application. This involves adding some code to your application that will collect telemetry data.
              The article you provided provides an example of how to instrument an Express.js application.
              3. Send the telemetry data to Uptrace.
              Once you have instrumented your application, you need to send the telemetry data to Uptrace. You can do this by configuring the OpenTelemetry exporter to send the data to Uptrace.
              The article you provided provides an example of how to configure the OpenTelemetry exporter to send data to Uptrace.
              I hope this helps! Let me know if you have any other questions.`,
            },
          },
        ],
        // Required. Alternating prompt/response messages.
        messages,
      },
    });

    return result;
  } catch (error) {
    return error;
  }
};
