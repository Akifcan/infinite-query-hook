import { FC, ReactNode } from "react"

const Container:FC<{children: ReactNode}> = ({children}) => {
    return <div className="container">  
        {children}
    </div>
}

export default Container