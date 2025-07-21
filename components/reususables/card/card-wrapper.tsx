import React from "react";
import { Card, CardBody } from "@heroui/react"



export const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <Card className="bg-white border border-darkCharcoal/20 rounded-lg">
            <CardBody className="p-6">
                {children}
            </CardBody>
        </Card>
    )
}
