import { Button } from '@chakra-ui/react'

function Crop() {

    const fetchWithLabel = async() => {
        const label = "rice"
        const response = await fetch(`http://localhost:9090/crops/${label}`)
        const data = await response.json()
        console.log(data)
    }
    return ( 
        <Button onClick={fetchWithLabel}>Fetch</Button>
     );
}

export default Crop;