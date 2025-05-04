
"use client"

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2, Upload } from "lucide-react"; // Added Upload icon

import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header"; // Import Header
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Define a Zod schema encompassing all showcased fields
const formSchema = z.object({
  textField: z.string().min(2, { message: "Text field must be at least 2 characters." }),
  emailField: z.string().email({ message: "Invalid email address." }),
  textareaField: z.string().max(500, { message: "Textarea cannot exceed 500 characters." }).optional(),
  selectField: z.enum(["Option1", "Option2", "Option3"]),
  radioGroupField: z.enum(["ChoiceA", "ChoiceB", "ChoiceC"]),
  dateField: z.date().optional(),
  checkboxField: z.boolean().default(false),
  fileField: z.any().optional(), // Use z.any() for file inputs, validation needs specific handling
});

type FormSchema = z.infer<typeof formSchema>;

export default function FormBuilderPage() {
  const { toast } = useToast();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textField: "",
      emailField: "",
      textareaField: "",
      selectField: "Option1",
      radioGroupField: "ChoiceA",
      checkboxField: false,
    },
  });

  // State to hold the name of the selected file
  const [fileName, setFileName] = React.useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : null);
    // In a real scenario, you'd handle the file upload here
    // For react-hook-form, you might use `form.setValue('fileField', file)`
    // or handle it separately depending on your upload strategy.
    console.log("Selected file:", file);
  };

  function onSubmit(values: FormSchema) {
    // We don't include the file field directly in 'values' as handled by react-hook-form here
    // In a real submit, you'd likely use FormData or a similar mechanism
    console.log("Form Submitted (excluding file):", values);
    console.log("Selected file name (state):", fileName);
    toast({
      title: "Form Submitted!",
      description: "Showcasing form submission handling.",
      variant: "default",
    });
    // Optionally reset the form and file name state
    // form.reset();
    // setFileName(null);
  }

  return (
    <AppLayout>
      <Header /> {/* Add Header */}
      <div className="p-4 md:p-6 lg:p-8"> {/* Add padding */}
        <h1 className="text-3xl font-bold mb-6 text-primary">Form Field Prototypes</h1>
        <p className="text-muted-foreground mb-6">
          This page demonstrates various form field components available in the application. Use these examples as a reference for building forms.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Field Examples</CardTitle>
            <CardDescription>Interact with different form elements.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Text Input Field */}
                <FormField
                  control={form.control}
                  name="textField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Input</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter some text" {...field} />
                      </FormControl>
                      <FormDescription>
                        A standard single-line text input field.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Input Field */}
                <FormField
                  control={form.control}
                  name="emailField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Input</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@domain.com" {...field} />
                      </FormControl>
                       <FormDescription>
                        An input field specifically for email addresses with validation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Textarea Field */}
                <FormField
                  control={form.control}
                  name="textareaField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Textarea</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter multiple lines of text..."
                          className="resize-y min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A multi-line text input field. Character limit: {field.value?.length ?? 0} / 500.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Select Field */}
                <FormField
                  control={form.control}
                  name="selectField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Dropdown</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Option1">Option 1</SelectItem>
                          <SelectItem value="Option2">Option 2</SelectItem>
                          <SelectItem value="Option3">Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                       <FormDescription>
                        A dropdown menu for selecting a single option.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Radio Group Field */}
                <FormField
                  control={form.control}
                  name="radioGroupField"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Radio Group</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="ChoiceA" />
                            </FormControl>
                            <FormLabel className="font-normal">Choice A</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="ChoiceB" />
                            </FormControl>
                            <FormLabel className="font-normal">Choice B</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="ChoiceC" />
                            </FormControl>
                            <FormLabel className="font-normal">Choice C</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Select one option from a set of mutually exclusive choices.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date Picker Field */}
                 <FormField
                  control={form.control}
                  name="dateField"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Picker</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0)) // Disable past dates
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                       <FormDescription>
                        Select a date from a calendar interface.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Checkbox Field */}
                <FormField
                  control={form.control}
                  name="checkboxField"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="checkbox-prototype" // Add id for label association
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel htmlFor="checkbox-prototype"> {/* Associate label */}
                          Checkbox Option
                        </FormLabel>
                        <FormDescription>
                          A single checkbox for boolean (true/false) selection.
                        </FormDescription>
                      </div>
                      <FormMessage /> {/* Needs to be outside the div with label/desc */}
                    </FormItem>
                  )}
                />

                {/* File Input Field (Styled) */}
                <FormItem>
                   <FormLabel htmlFor="file-upload">File Input</FormLabel>
                   <FormControl>
                    {/* Style the label as a button */}
                    <label htmlFor="file-upload" className={cn(
                      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                      "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Mimic outline button style
                      "h-10 px-4 py-2 cursor-pointer w-full sm:w-auto" // Adjust size and width
                     )}>
                      <Upload className="mr-2 h-4 w-4" /> {/* Icon */}
                      <span>{fileName ? 'Change File' : 'Choose File'}</span>
                    </label>
                  </FormControl>
                  {/* Hidden actual file input */}
                  <Input
                      id="file-upload"
                      type="file"
                      className="sr-only" // Hide the default input visually but keep it accessible
                      onChange={handleFileChange}
                      // You might bind this differently if using react-hook-form's register
                      // {...form.register("fileField")}
                    />
                  {/* Display selected file name */}
                  {fileName && (
                    <p className="text-sm text-muted-foreground mt-2">Selected: {fileName}</p>
                  )}
                  <FormDescription>
                     A standard file input styled as a button. Note: File handling logic (upload, validation) needs custom implementation.
                  </FormDescription>
                   {/* FormMessage for file input would require custom validation logic */}
                   {/* <FormMessage /> */}
                </FormItem>

                <div className="flex justify-end space-x-2 pt-6">
                   <Button type="button" variant="outline" onClick={() => {form.reset(); setFileName(null);}}>
                    <Trash2 className="mr-2 h-4 w-4" /> Reset Form
                  </Button>
                  <Button type="submit">
                    <PlusCircle className="mr-2 h-4 w-4" /> Submit (Test)
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}


    