import { Build } from "../../classes/build"

export const reducer = (build: Build, action: BuildAction) => {
    if (!build) {
        if (action.type === 'SWAP') {
            return action.build
        } else {
            throw new Error('No build')
        }
    } else {
        if (action.type === 'SWAP' && action.build === null) return null
        return build.reduce(action)
    }
}