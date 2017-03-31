import { injectable } from "inversify"

@injectable()
export class AnimationFrameSyncer {

    tasks: ((x?: number)=>void) [] = []
    endTasks: ((x?: number)=>void) [] = []
    triggered: boolean = false

    isAvailable(): boolean {
        return typeof requestAnimationFrame === "function"
    }

    onNextFrame(task: (x?: number)=>void) {
        this.tasks.push(task)
        this.trigger()
    }

    onEndOfNextFrame(task: (x?: number)=>void) {
        this.endTasks.push(task)
        this.trigger()
    }

    protected trigger() {
        if(!this.triggered) {
            this.triggered = true
            if(this.isAvailable())
                requestAnimationFrame((time: number) => this.run(time))
            else
                setTimeout((time: number)=>this.run(time))
        }
    }

    protected run(time: number) {
        const tasks = this.tasks
        const endTasks = this.endTasks
        this.triggered = false
        this.tasks = []
        this.endTasks = []
        tasks.forEach(task => task.call(undefined, time))
        endTasks.forEach(task => task.call(undefined, time))
    }
}