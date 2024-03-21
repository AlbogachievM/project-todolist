import React, {ChangeEvent, FC, memo, useCallback, useMemo} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import IconButton from '@mui/material/IconButton/IconButton';
import {Delete} from "@mui/icons-material";
import {Button, ButtonProps, Checkbox} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./state/tasks-reducer";
import {changeTodolistFilterAC, changeTodolistTitleAC, removeTodolistAC} from "./state/todolists-reducer";
import {AppRootStateType} from "./state/store";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    filter: FilterValuesType
}


export const TodolistRedux = memo((props: PropsType) => {
    // берет из стейта tasks и будет рендерить столько раз сколько раз изменяться данные взятые из стейта
    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.id])
    // изменяет данные в стейте - в дизпатче содержаться все редюсеры
    const dispatch = useDispatch()

    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(title, props.id))
    }, [dispatch, props.id])

    const removeTodolist = useCallback(() => {
        dispatch(removeTodolistAC(props.id))
    }, [dispatch, props.id])
    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleAC(title, props.id))
    }, [dispatch, props.id])

    const onAllClickHandler = useCallback(() => dispatch(changeTodolistFilterAC(props.id, "all")), [dispatch, props.id])
    const onActiveClickHandler = useCallback(() => dispatch(changeTodolistFilterAC(props.id, "active")), [dispatch, props.id])
    const onCompletedClickHandler = useCallback(() => dispatch(changeTodolistFilterAC(props.id, "completed")), [dispatch, props.id])



    tasks = useMemo(()=>{
        if (props.filter === "active") {
            tasks = tasks.filter(t => t.isDone === false);
        }
        if (props.filter === "completed") {
            tasks = tasks.filter(t => t.isDone === true);
        }
        return tasks
    }, [tasks, props.filter])



    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                tasks.map(t => {
                    const onClickHandler = () => dispatch(removeTaskAC(t.id, props.id))
                    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
                        let newIsDoneValue = e.currentTarget.checked;
                        dispatch(changeTaskStatusAC(t.id, newIsDoneValue, props.id))
                    }
                    const onTitleChangeHandler = (newValue: string) => {
                        dispatch(changeTaskTitleAC(t.id, newValue, props.id))
                    }


                    return <div key={t.id} className={t.isDone ? "is-done" : ""}>
                        <Checkbox
                            checked={t.isDone}
                            color="primary"
                            onChange={onChangeHandler}
                        />

                        <EditableSpan value={t.title} onChange={onTitleChangeHandler}/>
                        <IconButton onClick={onClickHandler}>
                            <Delete/>
                        </IconButton>
                    </div>
                })
            }
        </div>
        <div>
            <MButton variant={props.filter === 'all' ? 'outlined' : 'text'}
                     onClick={onAllClickHandler}
                     color={'inherit'}
                     title={'All'}
            >
            </MButton>
            <MButton variant={props.filter === 'active' ? 'outlined' : 'text'}
                     onClick={onActiveClickHandler}
                     color={'primary'}
                     title={'Active'}>
            </MButton>
            <MButton variant={props.filter === 'completed' ? 'outlined' : 'text'}
                     onClick={onCompletedClickHandler}
                     color={'secondary'}
                     title={'Completed'}>
            </MButton>
        </div>
    </div>
})
type MButtonType = {} & ButtonProps
const MButton: FC<MButtonType> = memo(({variant, onClick, color, title, ...rest}) => {
    return (
        <Button variant={variant}
                onClick={onClick}
                color={color}>{title}
        </Button>
    )
})
