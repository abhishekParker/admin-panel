"use client"; // Add this directive

import * as React from 'react'; // Import React for useState/useEffect if needed later
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, Users, DollarSign, Activity } from 'lucide-react'; // lucide-react icons are fine in client components
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
// Recharts components require client-side rendering
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer } from 'recharts';

// Sample data for charts - Keep static for now, or fetch/generate dynamically client-side if needed
const barChartData = [
  { month: 'Jan', value: 634 },
  { month: 'Feb', value: 721 },
  { month: 'Mar', value: 890 },
  { month: 'Apr', value: 543 },
  { month: 'May', value: 912 },
  { month: 'Jun', value: 780 },
];

const lineChartData = [
  { date: '2024-01', value: 320 },
  { date: '2024-02', value: 450 },
  { date: '2024-03', value: 380 },
  { date: '2024-04', value: 490 },
  { date: '2024-05', value: 510 },
  { date: '2024-06', value: 460 },
];

const pieChartData = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 300 },
  { name: 'Category D', value: 200 },
];

const PIE_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function DashboardPage() {
  // If data needs to be dynamic/random on client, use useEffect:
  // const [barData, setBarData] = React.useState(barChartData);
  // React.useEffect(() => {
  //   // Example: Generate random data on mount
  //   const randomBarData = barChartData.map(item => ({ ...item, value: Math.floor(Math.random() * 1000) }));
  //   setBarData(randomBarData);
  // }, []);
  // Use `barData` instead of `barChartData` below if using state

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold mb-6 text-primary">Dashboard Overview</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
             {/* Use BarChart from lucide-react */}
             <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34.5%</div>
            <p className="text-xs text-muted-foreground">-2.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
             <CardDescription>Bar chart showing monthly values.</CardDescription>
          </CardHeader>
          <CardContent>
             {/* Ensure ChartContainer wraps Recharts components */}
            <ChartContainer config={{ value: { label: 'Value', color: 'hsl(var(--primary))' } }} className="h-[250px] w-full">
               {/* Use ResponsiveContainer for Recharts */}
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={barChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  {/* Use Recharts Tooltip directly if ChartTooltip causes issues */}
                  <Tooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="dot" />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Growth Trend</CardTitle>
             <CardDescription>Line chart showing growth over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ value: { label: 'Value', color: 'hsl(var(--accent))' } }} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={lineChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="line" />} />
                  <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} dot={false} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Data Distribution</CardTitle>
            <CardDescription>Pie chart showing category distribution.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
              {/* Prepare config for Pie Chart */}
              <ChartContainer
                config={pieChartData.reduce((acc, cur, idx) => {
                  acc[cur.name] = { label: cur.name, color: PIE_COLORS[idx % PIE_COLORS.length] };
                  return acc;
                }, {} as any)} // Use any for simplicity here, define proper type if needed
                className="h-[250px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip cursor={false} content={<ChartTooltipContent hideLabel indicator="dot" nameKey="name" />} />
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
             </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
