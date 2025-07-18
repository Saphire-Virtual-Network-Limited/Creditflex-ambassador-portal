"use client"

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
} from "@heroui/react"
import cancelIcon from "@/public/assets/svgs/modal-cancel.svg";
import Image from "next/image";

export default function ModalWrap({ isOpen, onClose, children, title, size }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, title: string, size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full" }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={size}
            hideCloseButton
            scrollBehavior="inside"
            classNames={{
                backdrop: "bg-black/60 backdrop-blur-sm fixed inset-0 z-60",
                base: "bg-white rounded-lg shadow-xl z-70",
                body: "py-6",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex items-center justify-between pb-4 border-b">
                    <h2 className="text-base font-semibold text-primaryBlue">{title}</h2>
                    <span>
                        <Image onClick={onClose} className="cursor-pointer" src={cancelIcon} alt="cancel" />
                    </span>
                </ModalHeader>
                <ModalBody>
                    {children}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}