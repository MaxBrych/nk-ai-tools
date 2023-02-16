import React from "react";
import LoadingDots from "../LoadingDots";
import ResizablePanel from "../ResizablePanel";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../DropDown";
import Image from "next/image";
import { ToolProps, tools } from "../Tools";

import { useState } from "react";
import Subheader from "../Subheader";

interface ChatPageProps {
  tool: ToolProps;
}

const Chat: React.FC<ChatPageProps> = ({ tool }) => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Professional");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  console.log("Streamed response: ", generatedBios);
  const toolPrompt = tool.toolPrompt;

  const prompt = `${toolPrompt}$ ${bio}$`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedBios((prev) => prev + chunkValue);
    }

    setLoading(false);
  };
  return (
    <main className="flex flex-col items-end justify-end flex-1 w-full max-w-5xl min-h-screen px-4 pt-6 text-center md:h-full bg-cyan-95 md:flex-auto md:px-12 md:rounded-3xl ">
      {/* DROPDOWN */}
      <div className="hidden">
        <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
      </div>
      {/**/}
      <Subheader tool={tool} />
      <div />
      <div className="w-full h-full pb-4">
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />

        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="flex items-start justify-start my-10 space-y-10">
              {generatedBios && (
                <>
                  <div className="flex flex-col items-start justify-start max-w-xl mx-auto space-y-8">
                    {generatedBios
                      //.substring(generatedBios.indexOf("1") + 3)
                      .split("3.")
                      .map((generatedBio) => {
                        return (
                          <div
                            className="p-4 transition bg-white cursor-pointer rounded-3xl hover:bg-dark-99"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedBio);
                              toast("Text wurde kopiert", {
                                icon: "✂️",
                              });
                            }}
                            key={generatedBio}
                          >
                            <p className="text-left">{generatedBio}</p>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </div>

      {/* INPUT */}
      <div className="fixed  flex flex-row items-end justify-start w-[92vw] md:w-full gap-1 mb-4 left-4 bottom-2 md:relative md:gap-4">
        <textarea
          value={bio}
          //onKeyPress={(e) => generateBio(e)}
          onChange={(e) => setBio(e.target.value)}
          rows={1}
          className="flex items-center justify-center flex-1 w-full h-12 p-3 overflow-hidden bg-white border-white rounded-full resize-none md:p-4 placeholder:text-sm md:h-14 hover:border-dark-95 focus:border-cyan-90 focus:ring-cyan-90"
          placeholder={"Dein Text hier..."}
        />

        {!loading && (
          <button
            className="flex items-center justify-center flex-none w-12 h-12 font-medium text-white rounded-full md:w-14 md:h-14 bg-cyan-40 sm:mt-10 hover:bg-cyan-30"
            onClick={(e) => generateBio(e)}
          >
            <Image
              src={
                "https://drive.google.com/uc?export=view&id=1Xo-Lu07Qzm9zhs3BY8EGhNwZ8AL9xbVD"
              }
              alt={""}
              width={20}
              height={20}
            />
          </button>
        )}
        {loading && (
          <button
            className="flex items-center justify-center flex-none w-12 h-12 font-medium text-white rounded-full md:w-14 md:h-14 bg-cyan-50 sm:mt-10 hover:bg-cyan-40"
            disabled
          >
            <LoadingDots color="white" style="large" />
          </button>
        )}
      </div>
    </main>
  );
};

export const getStaticPaths = async () => {
  const paths = tools.map((tool) => ({
    params: { slug: tool.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const tool = tools.find((tool) => tool.slug === params.slug);

  return {
    props: {
      tool,
    },
  };
};

export default Chat;
