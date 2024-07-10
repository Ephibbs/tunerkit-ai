import blur from "/public/blur.png";
import example from "/public/example.png";
import result from "/public/result.png";
import CodeBlock from "@/components/ui/code-block";

export default function ExplainerSection() {
  return (
    <div className="w-full max-w-6xl mt-16 p-8 bg-gray-100 rounded-lg space-y-8 text-center">
      <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>

      {/* Step 1: Upload your images */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="text-3xl font-bold text-red-600 bg-white border-2 border-red-600 rounded-full w-10 h-10 flex items-center justify-center">
            1
          </div>
          <h3 className="text-2xl font-semibold">Install backless</h3>
        </div>
        <div className="text-center">
          <CodeBlock copyText={'npm i backless-ai'}>
            <span className="shrink-0 text-gray-500 user-select-none">$</span>
            <span className="flex-1">
              <span>npm i {' '}</span>
              <span className="text-yellow-500">backless-ai</span>
            </span>
          </CodeBlock>
        </div>
        <p className="text-sm text-gray-600 text-center">
          It's small and fast!
        </p>
      </div>

      {/* Step 2: Train your model */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="text-3xl font-bold text-red-600 bg-white border-2 border-red-600 rounded-full w-10 h-10 flex items-center justify-center">
            2
          </div>
          <h3 className="text-2xl font-semibold">Explore our components</h3>
        </div>
        <p className="text-sm text-gray-600 text-center max-w-lg m-auto">
          Add components to your site including standalone chat, modal chat, genative photo and many more. You can even build your own! 100% customizable and easy to use!
        </p>
      </div>

      {/* Step 3: Generate images */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="text-3xl font-bold text-red-600 bg-white border-2 border-red-600 rounded-full w-10 h-10 flex items-center justify-center">
            3
          </div>
          <h3 className="text-2xl font-semibold">Access data & metrics</h3>
        </div>
        <p className="text-sm text-gray-600 text-center max-w-lg m-auto">
          Access your users' conversations and images from your frontend or backend through our sdk.
        </p>
      </div>
    </div>
  );
}
