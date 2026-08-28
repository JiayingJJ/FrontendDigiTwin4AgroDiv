import {
    VStack,
    Input,
    Text,
    Button,
    Box,
    Image,
    FormControl,
    Heading
} from "@chakra-ui/react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { downloadImage } from "../../../api/file";
import { useSelector, useDispatch } from 'react-redux';

type Props = {
    name: string,
    hint: number,
    id: string,
    type: string
}
const FileUploadComponent = ({ name, hint, id, type }: Props) => {
    const dispatch = useDispatch()
    const editColumn = useSelector((state: any) => state.openLayers.editColumn)
    const userInputColumnValues = useSelector((state: any) => state.datasetTable.userInputColumnValues)
    const fileInputRef = useRef(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const updateImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const lastDotIndex = file.name.lastIndexOf(".");
            let uniqueFileName;
            if (lastDotIndex === -1) {
                uniqueFileName = `${file.name}_${Date.now()}`;
            } else {
                const namePart = file.name.substring(0, lastDotIndex);
                const replace = namePart.replaceAll(" ", "_")
                const extensionPart = file.name.substring(lastDotIndex);
                uniqueFileName = `${replace}_${Date.now()}${extensionPart}`;
            }
            dispatch({ type: 'openLayers/addFiles', payload: { id: id, name: uniqueFileName, file: file } })
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
    useEffect(() => {
        const run = async () => {
            const blob: any[] = [];
            const data = userInputColumnValues.filter((i: any) => i.id === id)
            const imageData = await downloadImage(data[0].value)
            blob.push({ colName: name, data: imageData });
            setImageFile(blob[0].data);
        };
        if (editColumn) {
            run();
        }
    }, [])
    return (
        <FormControl onMouseOver={() => { console.log() }}>
            <Heading as='h4' size='md' padding={"15px 0px 10px 0px"}>{name}</Heading>
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