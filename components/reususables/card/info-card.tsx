import React from "react";
import { Card, CardBody } from "@heroui/react"
import Image from "next/image";
import { CardWrapper } from "./card-wrapper";



export const InfoCard = ({ cardIcon, cardTitle, cardValue, currencyFormat }: { cardIcon: string, cardTitle: string, cardValue: number, currencyFormat?: boolean }) => {
    return (
        <CardWrapper>
            <div className="flex items-center gap-4">
                <div>
                    <Image src={cardIcon} alt="card-icon" width={64} height={97} />
                </div>
                <div>
                    <p className="text-sm text-primaryBlue font-medium mb-1">{cardTitle}</p>
                    <p className="text-3xl font-semibold text-darkCharcoal ">{
                        currencyFormat
                            ? `N${cardValue.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`
                            : cardValue}</p>
                </div>
            </div>
        </CardWrapper >

    )
}
