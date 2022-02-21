
// import React, {useContext} from "react";
// import { buildContext } from "../App";
// import { Build } from "../classes/build";

// interface BuildHook {
//     selectedBuild: Build
//     modifyBuild: (build: Build) => void
//     selectBuild: (buildId: number) => void
// }

// const useBuild = (): BuildHook => {
//     const {selectedBuild, setSelectedBuild, modifySelectedBuild} = useContext(buildContext)

//     const modifyBuild = (build: Build) => {
//         modifySelectedBuild(build)
//     }

//     const selectBuild = setSelectedBuild

//     return {selectedBuild, modifyBuild, selectBuild}
// }

// export default useBuild