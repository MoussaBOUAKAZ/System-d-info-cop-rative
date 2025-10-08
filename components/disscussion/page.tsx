import Discussion from "./Discussion"

export default function DiscussionPage() {
  return (
    <div className="p-6 space-y-6 pt-0 mt-0 pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discussion</h1>
          <p className="text-muted-foreground mt-1">Communiquez avec votre équipe et vos clients</p>
        </div>
      </div>

      <Discussion />
    </div>
  )
}
