import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
    imageSrc: string | null
}
const ModalShowInfo = ({imageSrc} : Props) => {
    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Information</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Information</DialogTitle>
                        <DialogDescription>
                            <img src={imageSrc}/>
                            This dialog has a sticky footer that stays visible while the content
                            scrolls.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <p key={index} className="mb-4 leading-normal">
                               Test
                            </p>
                        ))}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ModalShowInfo;