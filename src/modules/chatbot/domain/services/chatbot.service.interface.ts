export interface IChatbotService {
    runFlow(flowName: string, input: any): Promise<any>;
}
