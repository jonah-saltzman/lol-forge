import { Build } from "../../classes/build"

export default (build: Build, action: BuildAction) => {
    if (!build) {
        if (action.type === 'SWAP') {
            return action.build
        } else {
            throw new Error('No build to swap')
        }
    } else {
        return build.reduce(action)
    }
}