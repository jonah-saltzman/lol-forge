import { Build } from "../../classes/build"

export default (build: Build, action: BuildAction) => {
    return build.reduce(action)
}