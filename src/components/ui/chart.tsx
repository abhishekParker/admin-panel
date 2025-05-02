"use client"

import * as React from "react"
// Import ResponsiveContainer directly from recharts where needed
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ReactNode // Changed from RechartsPrimitive.ResponsiveContainer["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        {/* Removed ResponsiveContainer wrapper, should be used directly inside ChartContainer where needed */}
        {children}
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    // Generate CSS variables for colors
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentProps<typeof RechartsPrimitive.Tooltip>, "content"> & // Omit content prop
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
      // Add payload and active props expected by Recharts Tooltip content function
      payload?: any[]
      active?: boolean
      label?: string | number
    }
>(
  (
    {
      active, // Added active
      payload, // Added payload
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label, // Keep label prop
      labelFormatter,
      labelClassName,
      formatter,
      color, // Prop for forcing a color, not typically used with config
      nameKey, // Use this to key into payload/config
      labelKey, // Use this for the main label (often from x-axis)
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length || !active) { // check active state
        return null
      }

      const [item] = payload; // Use the first item for the label usually
      const key = `${labelKey || item?.payload?.xKey || item?.name || 'value'}`; // Try to get a key for the label
      let value = label; // Use the label prop first if provided

      // Try to get label from payload if labelKey is specified
      if (labelKey && item?.payload) {
         value = item.payload[labelKey];
      }

      // Use labelFormatter if provided
      if (labelFormatter && value !== undefined) { // check value is defined
        return (
          <div className={cn("font-medium", labelClassName)}>
            {/* Pass the raw payload to formatter */}
            {labelFormatter(value, payload)}
          </div>
        );
      }

      // Otherwise, display the value directly
      if (value === undefined || value === null) { // Check if value exists
        return null;
      }

      return <div className={cn("font-medium", labelClassName)}>{String(value)}</div>; // Ensure value is string

    }, [
      active, // depend on active
      payload, // depend on payload
      label, // depend on label prop
      labelKey, // depend on labelKey prop
      hideLabel,
      labelFormatter,
      labelClassName,
    ]);


    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            // Determine the key for configuration lookup
            const key = `${nameKey || item.name || item.dataKey || "value"}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            // Determine the color for the indicator
            const indicatorColor = item.color || item.payload?.fill || config[key]?.color || 'hsl(var(--foreground))'; // Fallback color


            return (
              <div
                key={item.dataKey || item.name || index} // Use a unique key
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon && !hideIndicator ? ( // Show icon if available and not hidden
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && ( // Show indicator div if not hidden
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {/* Use config label or fallback to item name/dataKey */}
                          {itemConfig?.label || item.name || item.dataKey}
                        </span>
                      </div>
                      {item.value !== undefined && item.value !== null && ( // Check value exists
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {/* Ensure value is formatted nicely */}
                          {typeof item.value === 'number' ? item.value.toLocaleString() : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent" // Renamed for clarity

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          // Use the value of the payload item as the key for config lookup, or fallback to dataKey
          const key = `${nameKey || item.value || item.dataKey || "value"}`;
          const itemConfig = getPayloadConfigFromPayload(config, item, key);
          const color = item.color || config[key]?.color; // Get color from payload or config

          return (
            <div
              key={item.value} // Use item.value as key since it's typically unique in legends
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {!hideIcon && ( // Check hideIcon prop
                itemConfig?.icon ? ( // Use icon from config if available
                  <itemConfig.icon />
                 ) : ( // Otherwise, use the colored square
                  <div
                    className="h-2 w-2 shrink-0 rounded-[2px]"
                    style={{
                      backgroundColor: color, // Use determined color
                    }}
                  />
                )
              )}
               {/* Use label from config or fallback to item value */}
              <span>{itemConfig?.label || item.value}</span>
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent" // Corrected display name

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string // The key used for lookup (e.g., dataKey, name, or a specific nameKey)
): ChartConfig[string] | undefined { // Return type adjusted
  if (typeof payload !== "object" || payload === null) {
    return undefined;
  }

  // Direct lookup in config using the provided key
  if (key in config) {
    return config[key];
  }

  // If the key represents a dataKey or name present in the payload item itself
  if ('dataKey' in payload && payload.dataKey === key && key in config) {
      return config[key];
  }
    if ('name' in payload && payload.name === key && key in config) {
      return config[key];
  }

  // Attempt lookup using the 'value' field, often used in legends
   if ('value' in payload && typeof payload.value === 'string' && payload.value in config) {
     return config[payload.value];
   }


  // Fallback or deeper inspection if necessary (e.g., nested payload.payload)
  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined;

  if (payloadPayload) {
      if (key in payloadPayload && key in config) {
           // This might be too generic, consider if key truly identifies the config entry
           // return config[key]; // Uncomment carefully if needed
      }
      // Example: Check if payloadPayload has a property that matches a config key
      for (const configKey in config) {
          if (key in payloadPayload && payloadPayload[key as keyof typeof payloadPayload] === configKey) {
              return config[configKey];
          }
      }
  }


  // If no specific config found, return undefined
  return undefined;
}


export {
  ChartContainer,
  ChartTooltip, // Keep exporting the original Recharts Tooltip
  ChartTooltipContent, // Export the custom content component
  ChartLegend, // Keep exporting the original Recharts Legend
  ChartLegendContent, // Export the custom content component
  ChartStyle,
  useChart, // Export useChart hook
  type ChartConfig, // Export ChartConfig type
}
