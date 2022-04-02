import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

export enum Tool {
    line,
    hand,
}

export interface ToolboxState {
    color: string;
    brushSize: number;
    tool: Tool;
}

const initialState: ToolboxState = {
    color: '#000',
    brushSize: 1,
    tool: Tool.line
}

export const toolboxSlice = createSlice({
    name: 'toolbox',
    initialState,
    reducers: {
        setColor: (state, action: PayloadAction<string>) => {
            state.color = action.payload;
        },
        setBrushSzie: (state, action: PayloadAction<number>) => {
            state.brushSize = action.payload;
        },
        setTool: (state, action: PayloadAction<Tool>) => {
            state.tool = action.payload
        },
    }
})

export const { setColor, setBrushSzie, setTool } = toolboxSlice.actions;

export const selectColor = (state: RootState) => state.toolbox.color
export const selectBrushSize = (state: RootState) => state.toolbox.brushSize
export const selectTool = (state: RootState) => state.toolbox.tool

export default toolboxSlice.reducer;