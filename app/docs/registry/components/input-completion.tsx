import {
    useEffect,
    useState,
    useRef,
    useMemo,
    Fragment,
    forwardRef,
    memo
} from "react";
import { ChatCompletionRequest, getPublicClient } from "backless-ai";
import './input-completion.css';

const client = getPublicClient('f5d86791-d513-48de-8fd2-b6dbdd4abe9b');

const prompt = `You are a master of knowing what the user will type next. Your job is to predict the next 5-10 words after the currently typed text provided any context. You must ensure that you include a space or line at the beginning of your prediction to fit into the currently typed text. Respond in json format using the key 'prediction' including any needed preceeding space or line. Always provide your best 5-10 word prediction, even if it the current text is vague. Do not request any follow-up information.

Context: {{context}}

Currently typed text: "{{text}}"`;

const CompleterInput = (
    {
        value,
        onChange,
        context = "",
        delay=1000,
        className = "",
        defaultValue = "",
        ...other
    }: any,
    ref: any
) => {
    const keyWordsRef = useRef<any>(null);
    // const [innerValue, setInnerValue] = useState(defaultValue);
    const innerValue = useRef(defaultValue);
    const [scrollValue, setScrollValue] = useState(0);
    const [prediction, setPrediction] = useState('');
    const [dirtyCount, setDirtyCount] = useState(0);
    const inputValue = value !== undefined ? value : innerValue.current;
    const timeoutRef = useRef<any>(null);

    const changeHandler = (e: any) => {
        if (onChange) onChange(e);
        setDirtyCount(dirtyCount + 1);
        innerValue.current = e.target.value;
        setPrediction('');
    };

    const scrollHandler = (e: any) => {
        setScrollValue(e.currentTarget.scrollLeft);
    };

    const submitHandler = (e: any) => {
        if (e.keyCode === 13 || e.key === "Enter" || e.which === 13) {
            if (!e.repeat && e.target.form) {
                e.target.form.submit();
            }
            e.preventDefault();
        }
        if (e.key === 'Tab' && prediction) {
            e.preventDefault();
            // Append prediction and reset prediction state
            const newText = innerValue.current + prediction;
            if (onChange) onChange({ target: { value: newText } });
            innerValue.current = newText;
            setPrediction('');
        } else if (e.key === 'Escape') {
            setPrediction('');
        }
    };

    useEffect(() => {
        if (keyWordsRef.current) {
            keyWordsRef.current.scrollLeft = scrollValue;
        }
    }, [scrollValue]);

    useEffect(() => {
        if (dirtyCount > 0) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (innerValue.current !== '') {
                timeoutRef.current = setTimeout(() => {
                    getPredictions(innerValue.current);
                    setDirtyCount(0);
                }, delay);
            }
        }
    }, [dirtyCount]);

    const getPredictions = async (inputText: any) => {
        if (!client) {
            console.error("OpenAI client is not defined.");
            return;
        }

        try {
            const response = await client.getCompletion({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'system',
                    content: prompt?.replace("{{context}}", context).replace("{{text}}", inputText),
                }], 
                response_format: { "type": "json_object" },
            });

            if (response && response.choices && response.choices.length > 0) {
                const predictedObjText = response.choices[0].message.content;
                console.log("Predicted object:", predictedObjText);
                const { prediction } = JSON.parse(predictedObjText);
                console.log("Predicted text:", prediction);
                // if inner value has not changed since the prediction was requested
                if (innerValue.current === inputText) {
                    setPrediction(prediction);
                }
            }
        } catch (error) {
            console.error("Failed to fetch predictions:", error);
        }
    };

    return (
        <div className={`Input ${className} relative overflow-hidden`}>
            <div ref={keyWordsRef} className="Input__keyWordsWrapper">
                <span className="inline whitespace-pre">
                    {inputValue}
                </span>
                <span className="text-gray-500 inline whitespace-pre">
                    {prediction}
                </span>
            </div>
            <textarea
                {...other}
                className="Input__field"
                ref={ref}
                value={inputValue}
                onChange={changeHandler}
                onScroll={scrollHandler}
                onKeyDown={submitHandler}
                rows={1}
            />
        </div>
    );
};

const MemoInput = memo(forwardRef(CompleterInput));

export default MemoInput;