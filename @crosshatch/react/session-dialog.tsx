export {}

// import { sessionDetailsAtom, useEndSession } from "@crosshatch/react"
// import { AddressButton } from "@crosshatch/ui/address-button"
// import { Button } from "@crosshatch/ui/button"
// import { Dialog, DialogContent } from "@crosshatch/ui/dialog"
// import { Separator } from "@crosshatch/ui/separator"
// import { Atom, useAtom, useAtomSuspense } from "@effect-atom/atom-react"
// import { Option } from "effect"
// import { Activity, Coins, LogOut, Settings2 } from "lucide-react"

// export const sessionDialogOpenAtom = Atom.make(false).pipe(
//   Atom.keepAlive,
// )

// export const SessionDialog = ({ children }: { children: React.ReactNode }) => {
//   const endSession = useEndSession()
//   const [sessionDialogOpen, setSessionDialogOpen] = useAtom(sessionDialogOpenAtom)
//   const { value } = useAtomSuspense(sessionDetailsAtom)

//   return (
//     <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
//       {children}
//       <DialogContent>
//         {Option.isSome(value) && (
//           <div className="flex flex-col">
//             <div className="flex flex-col gap-2 p-4">
//               {value.value.map(({ network, address }) => (
//                 <div>
//                   <div>{network}</div>
//                   <AddressButton key={address} {...{ address }} />
//                 </div>
//               ))}
//               <Separator className="my-2" />
//               <div className="flex flex-row flex-1 gap-2">
//                 <Button
//                   onClick={() => {
//                     setSessionDialogOpen(false)
//                     endSession()
//                   }}
//                   className="flex flex-1 text-red-400"
//                   variant="outline"
//                 >
//                   <LogOut className="stroke-1 stroke-red-400 size-4 rotate-180" />
//                   Disconnect
//                 </Button>
//                 <Button className="flex flex-1" variant="outline">
//                   <Settings2 className="stroke-1 size-4 rotate-180" />
//                   Settings
//                 </Button>
//                 <Button className="flex flex-1" variant="outline">
//                   <Activity className="stroke-1 size-4 rotate-180" />
//                   Activity
//                 </Button>
//                 <Button className="flex flex-1" variant="outline">
//                   <Coins className="stroke-1 size-4" />
//                   Assets
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </DialogContent>
//     </Dialog>
//   )
// }
