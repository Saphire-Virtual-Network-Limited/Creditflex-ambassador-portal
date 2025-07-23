"use client"

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
} from "@heroui/react"
import cancelIcon from "@/public/assets/svgs/modal-cancel.svg"
import Image from "next/image"

export default function ModalWrap({
    isOpen,
    onClose,
    children,
    title,
    size,
    hasHeader = true,
    mobileResponsive = false
}: {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string;
    hasHeader?: boolean
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full"
    mobileResponsive?: boolean
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={mobileResponsive ? "full" : size}
            hideCloseButton
            scrollBehavior="inside"
            placement={mobileResponsive ? "top" : "center"}
            classNames={{
                backdrop: "bg-black/60 backdrop-blur-sm inset-0 z-[100]",
                base: `bg-white h-fit rounded-lg shadow-xl z-[101] ${mobileResponsive ? 'md:max-w-4xl md:mx-auto md:my-8 md:rounded-lg md:placement-center' : ''} ${mobileResponsive ? 'rounded-none' : ''}`,
                wrapper: `z-[100] ${mobileResponsive ? 'p-0' : ''}`,
                body: `py-6 ${mobileResponsive ? 'px-4 md:px-6' : ''}`,
            }}
        >
            <ModalContent>
                {
                    hasHeader && (
                        <ModalHeader className={`flex items-center justify-between pb-4 border-b ${mobileResponsive ? 'px-4 md:px-6' : ''}`}>
                            <h2 className="text-base font-semibold text-primaryBlue">{title}</h2>
                            <span>
                                <Image
                                    onClick={onClose}
                                    className="cursor-pointer"
                                    src={cancelIcon}
                                    alt="cancel"
                                />
                            </span>
                        </ModalHeader>
                    )
                }

                <ModalBody className="overflow-visible">
                    {children}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
