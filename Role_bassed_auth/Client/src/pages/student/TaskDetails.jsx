import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

import { useGetSingleTask } from "@/hooks/student/useGetSingleTask";
import { useSubmitTask } from "@/hooks/student/useSubmitTask";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSingleTask(taskId);
  const { mutate } = useSubmitTask();

  const task = data?.task;

  // 🧠 get current student entry
  const myEntry = task?.assignedTo?.find((s) => s?.student?._id);

  const { register, handleSubmit } = useForm({
    defaultValues: { message: myEntry?.message || "" },
  });

  const submit = (status) =>
    handleSubmit((form) =>
      mutate(
        {
          taskId,
          status,
          message: form.message,
        },
        {
          onSuccess: () => navigate("/student/tasks"),
        }
      )
    )();

  if (isLoading || !task)
    return <p className="text-slate-600">Loading task...</p>;

  return (
    <div className="space-y-6 sm:space-y-8 w-full">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">Task Detail</h1>
      </div>

      <Card className="bg-white border border-slate-200 shadow-sm w-full">
        <CardContent className="p-4 sm:p-6">
          <form className="space-y-4 sm:space-y-6">

            {/* TEAM */}
            <div>
              <Label className='mb-1.5'>Team Name</Label>
              <Input disabled value={capitalizeFirstLetter(task.team?.teamName || "")} />
            </div>

            {/* TITLE */}
            <div>
              <Label className='mb-1.5'>Task Title</Label>
              <Input disabled value={capitalizeFirstLetter(task.title || "")} />
            </div>

            {/* DESCRIPTION */}
            <div className='mb-1.5'>
              <Label>Task Description</Label>
              <Textarea disabled value={capitalizeFirstLetter(task.description || "")} rows={4} />
            </div>

            {/* MANAGER REMARK */}
            {myEntry?.remark ? (
              <div className='mb-1.5'>
                <Label>Manager Remark</Label>
                <Textarea disabled value={capitalizeFirstLetter(myEntry.remark)} rows={4} />
              </div>
            ) : null}

            {/* STUDENT MESSAGE */}
            <div className='mb-1.5'>
              <Label>Your Message</Label>
              <Textarea
                placeholder="Write your message..."
                rows={4}
                {...register("message")}
              />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-4 border-t">

              <Button
                type="button"
                onClick={() => submit("completed")}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                Completed
              </Button>

              <Button
                type="button"
                onClick={() => submit("incompleted")}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
              >
                Incomplete
              </Button>

            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
