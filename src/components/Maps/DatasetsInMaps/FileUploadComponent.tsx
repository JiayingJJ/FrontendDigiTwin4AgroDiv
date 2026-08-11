import {
    VStack,
    Input,
    Text,
    Button,
    Box,
    Image,
    FormControl,
} from "@chakra-ui/react";
import { useRef, useState, type ChangeEvent } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { uploadImage } from "../../../api/file";
import { useSelector, useDispatch } from 'react-redux';

type Props = {
    name: string,
    hint: number,
    id: string,
    type: string
}
const FileUploadComponent = ({ name, hint, id, type }: Props) => {
    console.log(name)
    console.log(hint)
    const dispatch = useDispatch()

    const fileInputRef = useRef(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<String | null>(null);
    const userInfo = useSelector((state: any) => state.user)
    const updateImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            const lastDotIndex = file.name.lastIndexOf(".");
            let uniqueFileName;
            if (lastDotIndex === -1) {
                const replace = file.name.replaceAll(" ", "_")
                uniqueFileName = `${file.name}_${Date.now()}`;
            } else {
                const namePart = file.name.substring(0, lastDotIndex);
                console.log("namePart: ", namePart)

                const replace = namePart.replaceAll(" ", "_")
                console.log("replace: ", replace)

                const extensionPart = file.name.substring(lastDotIndex);
                console.log("extensionPart: ", extensionPart)

                uniqueFileName = `${replace}_${Date.now()}${extensionPart}`;
            }
            console.log("uniqueFileName: ", uniqueFileName)
            setFileName(uniqueFileName)
            console.log(file)
            setImageFile(file);
        }
    };
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const file = event.dataTransfer.files[0];
            setImageFile(file);
        }
    };
    const handleImageUploadClick = () => {
        fileInputRef.current?.click();
    };
    const handlerUpload = async () => {
        console.log(imageFile)
        console.log(fileName)
        const data = await uploadImage(fileName, imageFile, userInfo.id);
        console.log(id)
        console.log(data)
        dispatch({ type: 'datasetTable/updateUserInputColumnValues', payload: { id: id, value: data[1] } })

    }
    return (
        <FormControl onMouseOver={() => { console.log() }}>
            <Text mb='8px'>{name}</Text>
            {imageFile ? (
                <Image
                    maxWidth={"128px"}
                    maxHeight={"128px"}
                    src={URL.createObjectURL(imageFile)}
                    alt="Uploaded"
                />
            ) : (
                <VStack style={{ display: "flex", alignItems: "start" }}>
                    <Box cursor="pointer"
                        w="50%"
                        maxW="100%"
                        border="2px dashed"
                        borderColor={"gray.300"}
                        background={"gray.50"}
                        borderRadius="12px"
                        p={7}
                        transition="all 150ms ease"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        textAlign="center"
                        _hover={{ borderColor: "gray.400" }}
                        onDragOver={handleDragOver}
                        onDrop={handleFileDrop}
                        onClick={handleImageUploadClick}
                    ><FiUploadCloud size={30} /> {"Drag & Drop file here or click for select a file"}
                    </Box>
                </VStack>
            )}
            <Button onClick={() => handlerUpload()}>Upload</Button>
            <input
                ref={fileInputRef}
                type="file"
                accept={"image/*"}
                style={{ display: "none" }}
                onChange={updateImage}
            />
        </FormControl>

    );
}

export default FileUploadComponent;