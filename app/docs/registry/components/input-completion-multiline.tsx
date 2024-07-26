import {
    useEffect,
    useState,
    useRef,
    forwardRef,
    memo,
    ChangeEvent,
    KeyboardEvent,
    TextareaHTMLAttributes
} from "react";
import { ChatCompletionRequest, getPublicClient } from "backless-ai";
import './input-completion.css';

const client = getPublicClient('f5d86791-d513-48de-8fd2-b6dbdd4abe9b');

const prompt = `You are a master of knowing what the user will type next. Your job is to predict the next 5-10 words after the currently typed text provided any context. You must ensure that you include a space or line at the beginning of your prediction to fit into the currently typed text. Respond in json format using the key 'prediction' including any needed preceding space or line. Always provide your best 5-10 word prediction, even if the current text is vague. Do not request any follow-up information.

Context: {{context}}

Currently typed text: "{{text}}"`;

interface CompleterInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    value?: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    context?: string;
    delay?: number;
    className?: string;
    defaultValue?: string;
    multiline?: boolean;
}

const CompleterInput = (
    {
        value,
        onChange,
        context = "",
        delay = 1000,
        className = "",
        defaultValue = "",
        multiline = false,
        ...other
    }: CompleterInputProps,
    ref: React.Ref<HTMLTextAreaElement>
) => {
    const keyWordsRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const innerValue = useRef(defaultValue);
    const [scrollValue, setScrollValue] = useState(0);
    const [prediction, setPrediction] = useState('');
    const [dirtyCount, setDirtyCount] = useState(0);
    const inputValue = value !== undefined ? value : innerValue.current;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const changeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) onChange(e);
        setDirtyCount(dirtyCount + 1);
        innerValue.current = e.target.value;
        setPrediction('');
    };

    const submitHandler = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.keyCode === 13 || e.which === 13)) {
            if (!e.repeat && (e.target as HTMLTextAreaElement).form) {
                (e.target as HTMLTextAreaElement).form?.submit();
            }
            if (!multiline) {
                e.preventDefault();
            }
        }
        if (e.key === 'Tab' && prediction) {
            e.preventDefault();
            const newText = innerValue.current + prediction;
            if (onChange) onChange({ target: { value: newText } } as ChangeEvent<HTMLTextAreaElement>);
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

    const getPredictions = async (inputText: string) => {
        if (!client) {
            console.error("OpenAI client is not defined.");
            return;
        }

        try {
            const response = await client.getCompletion({
                model: 'gpt-3.5-turbo',
                messages: [{
                    role: 'system',
                    content: prompt.replace("{{context}}", context).replace("{{text}}", inputText),
                }],
                response_format: { type: "json_object" },
            });

            if (response && response.choices && response.choices.length > 0) {
                const predictedObjText = response.choices[0].message.content;
                const { prediction } = JSON.parse(predictedObjText);
                if (innerValue.current === inputText) {
                    setPrediction(prediction);
                }
            }
        } catch (error) {
            console.error("Failed to fetch predictions:", error);
        }
    };

    const syncScroll = (e: React.UIEvent<HTMLTextAreaElement | HTMLDivElement>) => {
        const source = e.target as HTMLElement;
        if (source === textAreaRef.current) {
            if (keyWordsRef.current) {
                keyWordsRef.current.scrollTop = source.scrollTop;
                keyWordsRef.current.scrollLeft = source.scrollLeft;
            }
        } else if (source === keyWordsRef.current) {
            if (textAreaRef.current) {
                textAreaRef.current.scrollTop = source.scrollTop;
                textAreaRef.current.scrollLeft = source.scrollLeft;
            }
        }
    };

    return (
        <div className={`Input-Multi ${className} relative overflow-hidden`}>
            <div ref={keyWordsRef} className="Input-Multi__keyWordsWrapper">
                <span className="inline whitespace-pre-wrap">
                    {inputValue}
                </span>
                <span className="text-gray-500 inline whitespace-pre-wrap break-words">
                    {prediction}
                </span>
            </div>
            <textarea
                {...other}
                className="Input-Multi__field"
                ref={ref || textAreaRef}
                value={inputValue}
                onChange={changeHandler}
                onScroll={syncScroll}
                onKeyDown={submitHandler}
                rows={multiline ? undefined : 1}
            />
        </div>
    );
};

const MemoInput = memo(forwardRef<HTMLTextAreaElement, CompleterInputProps>(CompleterInput));

export default MemoInput;
