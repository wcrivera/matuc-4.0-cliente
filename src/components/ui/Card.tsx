// src/components/ui/Card.tsx - Componente Card del Design System
'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const cardVariants = cva(
    // Base styles - aplicados siempre
    "rounded-xl border bg-card text-card-foreground shadow transition-all duration-200",
    {
        variants: {
            variant: {
                default: "bg-white border-gray-200 shadow-elevation-1",
                uc: "card-uc bg-white/95 border-white/20 shadow-uc backdrop-blur-sm",
                glass: "glass-morphism border-white/20 shadow-glass text-white",
                outline: "bg-transparent border-2 border-uc-azul shadow-none",
                elevated: "bg-white border-gray-200 shadow-elevation-2",
                flat: "bg-gray-50 border-gray-200 shadow-none",
                gradient: "bg-gradient-uc border-none text-white shadow-uc-lg"
            },
            size: {
                sm: "p-4",
                default: "p-6",
                lg: "p-8",
                xl: "p-10"
            },
            hover: {
                none: "",
                lift: "hover:-translate-y-1 hover:shadow-elevation-3",
                glow: "hover:shadow-glow-uc",
                scale: "hover:scale-[1.02]"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            hover: "none"
        }
    }
)

interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
    as?: React.ElementType
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, size, hover, as: Component = "div", ...props }, ref) => {
        return (
            <Component
                className={cn(cardVariants({ variant, size, hover, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)

Card.displayName = "Card"

// Sub-componentes para estructura semántica
const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 pb-4", className)}
        {...props}
    />
))

CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight text-uc-azul",
            className
        )}
        {...props}
    >
        {children}
    </h3>
))

CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))

CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("space-y-4", className)}
        {...props}
    />
))

CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center pt-4", className)}
        {...props}
    />
))

CardFooter.displayName = "CardFooter"

// Componentes especializados para MATUC
const MathCard = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => (
        <Card
            ref={ref}
            variant="uc"
            hover="lift"
            className={cn("math-container", className)}
            {...props}
        >
            {children}
        </Card>
    )
)

MathCard.displayName = "MathCard"

const ExerciseCard = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => (
        <Card
            ref={ref}
            variant="elevated"
            size="lg"
            hover="scale"
            className={cn("border-l-4 border-l-uc-celeste", className)}
            {...props}
        >
            {children}
        </Card>
    )
)

ExerciseCard.displayName = "ExerciseCard"

const DashboardCard = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, children, ...props }, ref) => (
        <Card
            ref={ref}
            variant="uc"
            hover="glow"
            className={cn("overflow-hidden", className)}
            {...props}
        >
            {children}
        </Card>
    )
)

DashboardCard.displayName = "DashboardCard"

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
    MathCard,
    ExerciseCard,
    DashboardCard,
    cardVariants,
    type CardProps
}