import { installationAtom, rotateAtom } from "@crosshatch/react"
import { Button } from "@crosshatch/ui/components/button"
import { Dialog, DialogContent } from "@crosshatch/ui/components/dialog"
import { Separator } from "@crosshatch/ui/components/separator"
import { Atom, useAtom, useAtomSet, useAtomSuspense } from "@effect-atom/atom-react"
import { Activity, Coins, LogOut, Settings2 } from "lucide-react"

export const installationDialogOpenAtom = Atom.make(false).pipe(
  Atom.keepAlive,
)

export const InstallationDialog = ({ children }: { children: React.ReactNode }) => {
  const rotate = useAtomSet(rotateAtom)
  const [open, onOpenChange] = useAtom(installationDialogOpenAtom)
  const { value } = useAtomSuspense(installationAtom)
  return (
    <Dialog {...{ open, onOpenChange }}>
      {children}
      <DialogContent>
        {value._tag === "Linked" && (
          <div className="flex flex-col">
            <div className="flex flex-col gap-2 p-4">
              <Separator className="my-2" />
              <div className="flex flex-row flex-1 gap-2">
                <Button
                  onClick={() => {
                    onOpenChange(false)
                    rotate({ payload: void 0 })
                  }}
                  className="flex flex-1 text-red-400"
                  variant="outline"
                >
                  <LogOut className="stroke-1 stroke-red-400 size-4 rotate-180" />
                  Disconnect
                </Button>
                <Button className="flex flex-1" variant="outline">
                  <Settings2 className="stroke-1 size-4 rotate-180" />
                  Settings
                </Button>
                <Button className="flex flex-1" variant="outline">
                  <Activity className="stroke-1 size-4 rotate-180" />
                  Activity
                </Button>
                <Button className="flex flex-1" variant="outline">
                  <Coins className="stroke-1 size-4" />
                  Assets
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
