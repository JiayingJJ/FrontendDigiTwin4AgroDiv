import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    FormControl,
    FormLabel,
    Input,
    IconButton,
    HStack
} from '@chakra-ui/react'
import { CiCircleCheck } from "react-icons/ci";
import { fetchUserWithEmail } from '../../api/user';
import { updateProjectMembers } from '../../api/projects';
import { buttonIconStyle } from '../Dashboard';
import { BiCheck } from 'react-icons/bi';
const AddMember = () => {
    const selectedProject = useSelector((state: any) => state.projects.selectedProject)

    const dispatch = useDispatch()
    const [valueEmail, setValueEmail] = useState<string>("");
    const setAlert = (status: string, title: string, msg: string, show: boolean) => {
        dispatch({ type: 'alertInfo/setAlertStatus', payload: status })
        dispatch({ type: 'alertInfo/setAlertTitle', payload: title })
        dispatch({ type: 'alertInfo/setAlertMessage', payload: msg })
        dispatch({ type: 'alertInfo/setShowAlert', payload: show })
    }
    const handleChange = (e: any) => {
        setValueEmail(e.target?.value)
        console.log(e.traget?.value)
    }
    const handleCheckUser = async () => {
        const data = await fetchUserWithEmail(valueEmail)
        console.log(data)
        if (data[1] !== 200) {
            setAlert("error", "Error Message", data[0].error, true)
        } else {
            const idsInProject = Object.values(selectedProject.members.RawMessage)
            const existInProject = idsInProject.includes(data[0].id)
            if (existInProject) {
                setAlert("warning", "Check the input", "User already exist in the Project", true)
            } else {
                const addMemberData = await updateProjectMembers(selectedProject.id, data[0].id, "pending")
                dispatch({ type: 'projects/setGetUpdateFromDatabase', payload: true })
                dispatch({ type: 'projects/setAddMember', payload: false })
            }
        }
    }
    return (
        <FormControl>
            <FormLabel>Please enter the email address of your team member</FormLabel>
            <HStack>
                <Input type='email' placeholder={"Email address"} value={valueEmail} onChange={(e) => handleChange(e)} />
                <IconButton
                    {...buttonIconStyle}
                    aria-label='Add member'
                    icon={<BiCheck size="1.5rem" />}
                    onClick={() => handleCheckUser()}
                />
            </HStack>
        </FormControl>
    );
}

export default AddMember;