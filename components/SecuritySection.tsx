import blur from "/public/blur.png";
import example from "/public/example.png";
import result from "/public/result.png";

export default function SecuritySection() {
  return (
    <div className="w-full max-w-6xl mt-16 p-8 rounded-lg space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8">Private & Secure</h2>

      {/* Step 1: Upload your images */}
      <div className="space-y-4">
        <p className="text-sm text-gray-600 text-center max-w-xl m-auto">
          Backless AI is built with top-notch security. All data that passes through Backless AI is secured by top-grade encryption at rest and in transit built on top of your existing authentication system.
        </p>
      </div>

    </div>
  );
}
