import React, { useEffect } from "react";

// Markdown
import rehypeHighlight from "rehype-highlight";
import ReactMarkdown from "react-markdown";
import "highlight.js/styles/base16/ros-pine.css";

import { LLMDashboardContext } from "../../../context/llm-dashboard/context";
import VirtualizedList from "../../../base-component/virtualized-list/virtualized-list";
import { handleUserPrompt } from "../../../api/llm-dashboard-api";
import TextArea from "../../../base-component/text-area/text-area";
import { Message } from "../../../data/llm-data";

interface LLMPrimaryContentsProps {
  toast: any;
}

export const LLMPrimaryContents = ({ toast }: LLMPrimaryContentsProps) => {
  const context = React.useContext(LLMDashboardContext);
  if (!context) {
    toast.error("Unable to retrieve LLM Dashboar Context");
    return;
  }

  const { messages, setMessages, activeTitleId, currentPrompt, setCurrentPrompt, awaitingResponse } = context;

  useEffect(() => {
    const tempMessages = [];
    for (let i = 1; i <= 30; i++) {
      const message: Message = {
        role: i%2==0 ? "chat user" : "chat",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur consequat, odio sed viverra dictum, velit dui feugiat dui, eu tempus magna velit nec tellus. Nullam vehicula purus elit, nec aliquam turpis auctor id. Morbi ut enim porta, elementum arcu a, condimentum felis. In iaculis vestibulum elit. Etiam cursus gravida ex ac luctus. Donec dictum mattis turpis, id consequat enim rutrum ut. Morbi ligula metus, ultrices at gravida et, venenatis nec diam. Curabitur hendrerit turpis mi, non rutrum felis porta ut. Aenean a ante lorem. Aliquam luctus tempor tellus. Mauris sit amet dui ut urna bibendum blandit."
      };
      tempMessages.push(message);
    }
    setMessages(tempMessages)
  }, []);

  return (
    <main className="llm-dashboard-contents">
      {/* Entire Convo Area - Search Bar */}
      <div className="conversation-container">
        {/* Actual Chat Area - 50% Subset of Entire Convo Area */}
        <div className="chat-zone">
          <VirtualizedList
            rowCount={messages.length}
            rowComponent={(index) => (
              <div key={index} className={messages[index].role == "user" ? "chat user" : "chat"}>
                {messages[index].role == "assistant" && <h3>LLM served by DouDou and Soba</h3>}
                <ReactMarkdown
                  children={messages[index].content}
                  rehypePlugins={[[rehypeHighlight, { detect: true, plainText: ["makefile", "bash"] }]]}
                ></ReactMarkdown>
              </div>
            )}
            isConversationPage={true}
          />
        </div>
      </div>

      {activeTitleId != null && (
        <form className="footer" onSubmit={(e) => handleUserPrompt(toast, context, e)}>
          <TextArea
            placeholder="Ask a question..."
            cssStyle="prompt-search"
            text={currentPrompt}
            onChange={setCurrentPrompt}
            onEnterDown={() => handleUserPrompt(toast, context)}
            isLocked={awaitingResponse}
          />
          <button
            type="submit"
            id="submit-prompt"
            disabled={currentPrompt.length > 0 ? false : true}
            className={currentPrompt ? "submit ok" : "submit"}
          >
            🡩
          </button>
        </form>
      )}
    </main>
  );
};
