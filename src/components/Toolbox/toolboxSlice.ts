import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';

export interface ToolboxState {
    color: string;
    brushSize: number;
}

const initialState: ToolboxState = {
    color: '#000',
    brushSize: 1,
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
        }
    }
})

export const { setColor, setBrushSzie } = toolboxSlice.actions;

export const selectColor = (state: RootState) => state.toolbox.color
export const selectBrushSize = (state: RootState) => state.toolbox.brushSize

export default toolboxSlice.reducer;