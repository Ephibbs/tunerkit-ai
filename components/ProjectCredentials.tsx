import CodeBlock from "@/components/ui/code-block";

export default function ProjectCredentials() {
  return (
    <div className="w-full mt-16 p-8 bg-gray-100 rounded-lg space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8">Project Credentials</h2>
      <div className="flex items-center justify-center space-x-4">
        <h3 className="text-2xl font-semibold">Project ID</h3>
        <CodeBlock>
          asdf9asdfa7sdfas7f
        </CodeBlock>
      </div>
      <div className="flex items-center justify-center space-x-4">
        <h3 className="text-2xl font-semibold">API Key</h3>
        <CodeBlock>
          asdf9asdfa7sdfas7f
        </CodeBlock>
      </div>
    </div>
  );
}
