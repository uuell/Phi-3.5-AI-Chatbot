import { HfInference } from "@huggingface/inference"; 


export const handleSendMessage = async (inputText, chatHistory, setChatHistory, setInputText, setIsLoading) => {
    if (inputText.trim()) {
      setChatHistory((prev) => [...prev, { role: "user", content: inputText }]);
      setInputText(""); 
      setIsLoading(true); 
      const token  = process.env.NEXT_PUBLIC_HF_TOKEN ;

      try {
        setIsLoading(true);
        const inference = new HfInference(token);
        const chatCompletion = await inference.chatCompletion({
          model: "microsoft/Phi-3-mini-4k-instruct",
          messages: [
            ...chatHistory,
            { role: "user", content: inputText }
          ],
          max_tokens: 1000
        });

        const response = chatCompletion.choices[0].message.content;
        console.log(response);
        
        setChatHistory((prev) => [...prev, { role: "assistant", content: response }]);
      } catch (error) {
            console.error("Error generating text:", error);
            alert("An error occurred. Please try again later.");
            setIsLoading(false);
      } finally {
        setIsLoading(false); // Stop the loader
    }
    setInputText("");
    }
};