export default defineEventHandler(() => {
  const { user } = useContext()
  return user
})
