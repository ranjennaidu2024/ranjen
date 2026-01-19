export default function RemoteMCP() {
  return (
    <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6">
      <h2 className="text-2xl font-bold text-zinc-900 mb-3">Remote MCP</h2>
      <p className="text-sm text-zinc-600 mb-4">
        Connect directly to Groot's remote MCP server for a seamless experience without local installation or configuration. 
        Select your desired API key and click the button below to generate the MCP connection URL. For examples on how to use the remote MCP, click{" "}
        <a href="#" className="font-medium text-blue-600 underline hover:text-blue-700">
          here
        </a>
        .
      </p>
      <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700">
        Generate MCP Connection URL
      </button>
    </div>
  );
}
