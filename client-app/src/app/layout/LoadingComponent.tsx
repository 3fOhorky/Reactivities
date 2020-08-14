import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

export const LoadingComponent: React.FC<{content?: string, inverted?: boolean}> = ({content, inverted = true}) => {
    return (
        <Dimmer active inverted={inverted}>
            <Loader content={content} />
        </Dimmer>
    )
}
