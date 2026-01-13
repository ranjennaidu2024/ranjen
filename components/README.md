# Sidebar Component

A reusable sidebar component inspired by the Tavily dashboard design.

## Features

- **Logo Section**: Displays the application logo and name
- **Personal Dropdown**: A collapsible dropdown for account/workspace selection
- **Navigation Menu**: Clean navigation with icons and labels
- **External Links**: Support for external links with an external link icon
- **Active State**: Highlights the currently active page
- **User Profile**: Fixed bottom section showing user information
- **Hideable**: Optional toggle button to show/hide the sidebar with smooth animations
- **Fixed Position**: Stays in place while page content scrolls

## Usage

### Basic Usage (Always Visible)

```tsx
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar activePage="overview" />
      <main className="ml-72">
        {/* Your main content */}
      </main>
    </div>
  );
}
```

### With Toggle Functionality (Hideable)

```tsx
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen">
      <Sidebar 
        activePage="overview"
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className={`transition-all duration-300 ${isSidebarOpen ? "ml-72" : "ml-0"}`}>
        {/* Your main content */}
      </main>
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activePage` | `string` | `"overview"` | The ID of the currently active page to highlight in the navigation |
| `isOpen` | `boolean` | `true` | Controls whether the sidebar is visible or hidden |
| `onToggle` | `() => void` | `undefined` | Callback function to toggle the sidebar. When provided, a toggle button will be displayed |

## Available Page IDs

- `overview`
- `api-playground`
- `use-cases`
- `billing`
- `settings`
- `certification`
- `documentation`
- `tavily-mcp`

## Customization

To customize the sidebar:

1. **Logo**: Replace the SVG in the logo section with your own logo
2. **Navigation Items**: Modify the `navItems` array in the component
3. **User Profile**: Update the user name and avatar in the bottom section
4. **Colors**: Adjust the Tailwind classes for different color schemes

## Design Notes

The sidebar follows these design principles from the Tavily dashboard:

- Clean, minimal design with ample whitespace
- Consistent icon sizes (5x5 for nav items)
- Subtle hover states
- Active state with blue background and text
- External links indicated with an icon
- Fixed user profile at the bottom
